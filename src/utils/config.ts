import { InCartConfig, InCartEnv } from '../services/client'
import { get } from 'lodash'


const configurations = {
  prod: {
    apiKey: '',
    baseURL: 'https://www.incart.co/',
  },
  qa: {
    apiKey: '',
    baseURL: 'https://qa.incart.co/',
  },
  alpha: {
    apiKey: '',
    baseURL: 'https://alpha.incart.co/',
  },
}
type  OrderServiceConfig = InCartConfig

type serviceConfiguration = {
  incart: typeof configurations
  order: {
    [key in InCartEnv]?: OrderServiceConfig
  }
}

type Services = keyof serviceConfiguration

const serviceConfigurations: serviceConfiguration = {
  incart: configurations,
  order: {
    qa: {
      baseURL: 'https://gd5ro7xmjk.execute-api.ap-southeast-1.amazonaws.com/qa/order/v1/',
      apiKey: '',
    },
    alpha: {
      baseURL: 'https://gd5ro7xmjk.execute-api.ap-southeast-1.amazonaws.com/qa/order/v1/',
      apiKey: '',
    },
  }
}

export const getConfiguration = (o: InCartEnv, service?: Services, overrideApiKey?: string): InCartConfig => {
  const configurations = getServiceConfiguration(service)
  const basic = () => {
    if (o === 'A' || o === 'alpha') return configurations.alpha
    if (o === 'Q' || o === 'qa') return configurations.qa
    if (o === 'P' || o === 'prod') return configurations.prod
    throw new Error(`Unknown environment "${o}".`)
  }
  if (overrideApiKey) {
    return {
      ...basic(),
      apiKey: overrideApiKey
    }
  }
  return basic()
}

export const getServiceConfiguration = (service: Services = 'incart'): any => {
  let serviceConfiguration: any
  serviceConfiguration = get(serviceConfigurations, service)
  if (!serviceConfiguration){
    throw new Error(`Unknown service "${service}".`)
  }
  return serviceConfiguration
}
