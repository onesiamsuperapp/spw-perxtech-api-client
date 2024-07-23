import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Loggy } from 'spw-kobp'

export * from './cerialize'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

export function logAxiosResponse(resp: AxiosResponse): number {
  const { config, status, statusText, request, data, headers: respHeaders } = resp
  const fullUrl = `${config.baseURL}${request.path}`

  const [requestedAt, responseTime] = getTimeRelatedProperties(config)

  const summaryLine = `${status} [${request.method}] – ${fullUrl}`
  const rawRequestHeader = request._header

  // TODO BE-AWARE reward and voucher response body could be huge
  Loggy.log(`[PerxClient:AccessLog] ${requestedAt} : ${summaryLine}`, statusText,
    {
      requetHeader: rawRequestHeader,
      requestBody: config.data || {},
      responseTime: `+(${responseTime})ms`,
      responseBody: data,
      responseHeader: respHeaders,
    })

  // TODO better return
  // minimun return the responseTime which used in _sendMetric function
  return responseTime
}

export function logAxiosErrorResponse(error: any): number {
  // sometime response could be undefined
  // docs -> https://github.com/axios/axios/tree/v0.21.1?tab=readme-ov-file#handling-errors
  if (error.response) {
    return logAxiosResponse(error.response)
  } else if (error.request) {
    // somehow cannot get response back
    // then logging only request
    const { request, config } = error
    const { method, path, _header: rawReqHeaders } = request
    const fullUrl = `${config.baseURL}${path}`

    const [requestedAt, responseTime] = getTimeRelatedProperties(config)

    const summaryLine = `[NO RESPONSE] [${method}] – ${fullUrl}`

    Loggy.log(`[PerxClient:AccessLog:RequestOnly] ${requestedAt} ${summaryLine}`, {
      requestHeaders: rawReqHeaders,
      requestBody: config.data || {},
      responseTime: `+(${responseTime})ms`,
      errorMessage: error.message,
    })

    return responseTime
  } else {
    // Something happened in setting up the request that triggered an Error
    const { config, message } = error
    const [requestedAt, responseTime] = getTimeRelatedProperties(config)

    const summaryLine = `[NO-REQ] [NO-RES] – ${config.baseURL}`

    Loggy.log(`[PerxClient:AccessLog:Error] ${requestedAt} ${summaryLine} – ${message}`)
    return responseTime
  }
}

function getTimeRelatedProperties(config: CustomAxiosRequestConfig): [string, number] {
  const requestedAt = config.metadata?.startTime
  let responseTime = 0
  let requestedAtString = ''
  if (requestedAt) {
    responseTime = Date.now() - requestedAt
    requestedAtString = new Date(requestedAt).toISOString()
  }
  return [requestedAtString, responseTime]
}
