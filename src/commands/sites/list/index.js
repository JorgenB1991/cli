const AsciiTable = require('ascii-table')
const { Command } = require('@oclif/command')
const { CLIError } = require('@oclif/errors')
const config = require('../../../utils/config')
const API = require('../../../utils/api')

class SitesListCommand extends Command {
  async run() {
    // const { flags } = this.parse(SitesListCommand)
    await this.config.runHook('login')
    const client = new API(config.get('accessToken'))

    // Fetch all sites!
    client.api.listSites(null, (err, sites) => {
      if (err) {
        throw new CLIError(err)
      }

      if (sites && sites.length) {
        const logSites = sites.map((site) => {
          return {
            id: site.id,
            name: site.name,
            ssl_url: site.ssl_url
          }
        })

        // Build a table out of sites
        const table = new AsciiTable('Netlify Sites')
        table.setHeading('Name', 'Url', 'id')

        logSites.forEach((s) => {
          table.addRow(s.name, s.ssl_url,  s.id)
        })

        // Log da sites
        console.log(table.toString())
      }
    })
  }
}

SitesListCommand.description = `list sites
...
Extra documentation goes here
`

module.exports = SitesListCommand
