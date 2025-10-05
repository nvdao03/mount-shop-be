import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import '../configs/env.config'
import fs from 'fs'
import path from 'path'

const sesClient = new SESClient({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddress,
  subject,
  body,
  ccAddress = [],
  replyToAddress = []
}: {
  fromAddress: string
  toAddress: string | string[]
  subject: string
  body: string
  ccAddress?: string | string[]
  replyToAddress?: string | string[]
}) => {
  return new SendEmailCommand({
    Destination: {
      ToAddresses: toAddress instanceof Array ? toAddress : [toAddress],
      CcAddresses: ccAddress instanceof Array ? ccAddress : [ccAddress]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: body
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddress instanceof Array ? replyToAddress : [replyToAddress]
  })
}

export const sendEmail = ({ body, subject, toAddress }: { body: string; subject: string; toAddress: string }) => {
  const sendEmailConmand = createSendEmailCommand({
    body,
    subject,
    toAddress,
    fromAddress: process.env.AWS_FROM_ADDRESS as string
  })

  return sesClient.send(sendEmailConmand)
}

const verifyEmailTemplate = fs.readFileSync(path.resolve('src/templates/verify-email.html'), 'utf-8')
const verifyForgotPasswordTemplate = fs.readFileSync(path.resolve('src/templates/verify-forgot-password.html'), 'utf-8')

export const sendVerifyEmail = ({
  toAddress,
  email_verify_token,
  template = verifyEmailTemplate
}: {
  toAddress: string
  email_verify_token: string
  template?: string
}) => {
  return sendEmail({
    body: template.replace(
      '{{link}}',
      `${process.env.CLIENT_REDIRECT_URL_VERIFY_EMAIL}/verify-email?email_verify_token=${email_verify_token}`
    ),
    subject: 'Xác minh email của bạn',
    toAddress
  })
}

export const sendForgotPasswordEmail = ({
  toAddress,
  forgot_password_token,
  template = verifyForgotPasswordTemplate
}: {
  toAddress: string
  forgot_password_token: string
  template?: string
}) => {
  return sendEmail({
    body: template.replace(
      '{{link}}',
      `${process.env.CLIENT_REDIRECT_URL_VERIFY_FORGOT_PASSWORD_EMAIL}/verify-forgot-password?forgot_password_token=${forgot_password_token}`
    ),
    subject: 'Đặt lại mật khẩu của bạn',
    toAddress
  })
}
