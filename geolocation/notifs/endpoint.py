import endpoints as endpoint
if endpoint.startswith('https://fcm.googleapis.com/fcm/send'):
    endpointParts = endpoint.split('/')
    registrationId = endpointParts[len(endpointParts) - 1]

    endpoint = 'https://fcm.googleapis.com/fcm/send'