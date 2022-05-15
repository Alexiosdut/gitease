import shell from 'shelljs'
import { requireGit } from '../utils/requireGit.js'
import { logMessage } from '../utils/logMessage.js'

export function lastCommitAdd(program) {
  program
    .command({
      name: 'last-commit-add',
      description: 'Add files to the latest commit',
    })
    .argument({ name: 'files', isRequired: true, acceptMultipleValues: true })
    .action(files => {
      requireGit(shell)

      shell.echo(logMessage.info + 'Adding files')
      files.forEach(file => shell.exec(`git add ${file}`, { silent: true }))
      shell.exec('git commit --amend --no-edit')
    })
}