import shell from 'shelljs'
import { pullOption } from '../options/pullOption.js'
import { branchExistOnRemote } from '../utils/branchExistOnRemote.js'
import { getCurrentLocalBranch } from '../utils/getCurrentLocalBranch.js'
import { localBranchHasCommits } from '../utils/localBranchHasCommits.js'
import { logMessage } from '../utils/logMessage.js'
import { pullRemoteChangesIfNeeded } from '../utils/pullRemoteChangesIfNeeded.js'
import { requireGit } from '../utils/requireGit.js'
import { stashDoThenPop } from '../utils/stashDoThenPop.js'

export function push(program) {
  program
    .command({
      name: 'push',
      description: 'Push local branch commits to remote branch after updating from it',
    })
    .options([pullOption])
    .action(async ({ pull }) => {
      requireGit(shell)
      const currentLocalBranch = getCurrentLocalBranch(shell)
      const pullOptionIsUsed = pull != undefined

      await stashDoThenPop(shell, async () => {
        if (branchExistOnRemote(shell, currentLocalBranch)) {
          let msg
          if (pullOptionIsUsed) {
            msg =
              logMessage.info +
              `'${currentLocalBranch}' branch exist on remote. Check if pull needed before pushing the changes`
          } else {
            msg =
              logMessage.info +
              `'${currentLocalBranch}' branch exist on remote. Pushing the changes`
          }
          shell.echo(msg)

          if (pullOptionIsUsed) {
            await pullRemoteChangesIfNeeded(shell, currentLocalBranch)
          }
        } else {
          shell.echo(
            logMessage.info +
              `'${currentLocalBranch}' branch does not exist on remote. Pushing new branch to remote`,
          )
        }

        if (localBranchHasCommits(shell)) {
          shell.exec(`git push origin -u ${currentLocalBranch}`, {
            silent: true,
          })
          shell.echo(
            logMessage.success +
              `Commits are pushed to remote '${currentLocalBranch}' branch`,
          )
        } else {
          shell.echo(logMessage.info + 'There are no commits to push')
        }
      })
    })
}