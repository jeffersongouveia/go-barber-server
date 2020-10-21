import handlebars from 'handlebars'

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import IParseMailTemplateDTO from '@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO'

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse(data: IParseMailTemplateDTO): Promise<string> {
   const parseTemplate = handlebars.compile(data.template)
   return parseTemplate(data.variables)
  }
}

export default HandlebarsMailTemplateProvider
