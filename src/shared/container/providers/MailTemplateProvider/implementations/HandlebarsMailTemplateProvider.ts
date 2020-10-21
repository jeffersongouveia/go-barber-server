import handlebars from 'handlebars'
import fs from 'fs'

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO'

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
    const template = await fs.promises.readFile(data.file, { encoding: 'utf-8' })
    const parseTemplate = handlebars.compile(template)
    return parseTemplate(data.variables)
  }
}

export default HandlebarsMailTemplateProvider
