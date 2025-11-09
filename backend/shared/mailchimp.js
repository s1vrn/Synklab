const mailchimp = require('mailchimp-marketing')

const {
  MAILCHIMP_API_KEY,
  MAILCHIMP_SERVER_PREFIX,
  MAILCHIMP_AUDIENCE_ID,
} = process.env

let configured = false

if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
  mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX,
  })
  configured = true
} else {
  console.warn(
    'Mailchimp is not fully configured. Set MAILCHIMP_API_KEY and MAILCHIMP_SERVER_PREFIX to enable newsletter signups.',
  )
}

const isConfigured = () => configured && Boolean(MAILCHIMP_AUDIENCE_ID)

const subscribeEmail = async (email) => {
  if (!isConfigured()) {
    const error = new Error('Mailchimp is not configured')
    error.code = 'CONFIGURATION_ERROR'
    throw error
  }

  try {
    await mailchimp.lists.addListMember(MAILCHIMP_AUDIENCE_ID, {
      email_address: email,
      status: 'subscribed',
    })

    return { status: 'subscribed' }
  } catch (error) {
    if (error?.response?.body?.title === 'Member Exists') {
      return { status: 'exists' }
    }
    error.code = error.code || 'MAILCHIMP_ERROR'
    throw error
  }
}

module.exports = {
  subscribeEmail,
  isConfigured,
}

