import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { MailParams } from './mail.constants';


@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: false, 
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
  }

  async send(mail: MailParams): Promise<boolean> {
    const mailOptions = {
      from: this.configService.get<string>('MAIL_FROM'), 
      to: mail.to, 
      subject: mail.subject, 
      text: mail.content, 
      html: mail.html, 
    };

    await this.transporter.sendMail(mailOptions);

    return true;
  }
}
