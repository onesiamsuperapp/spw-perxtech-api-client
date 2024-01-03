import { AxiosResponse, AxiosRequestConfig } from 'axios'
import { Loggy } from 'spw-kobp'

export * from './cerialize'

export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  metadata?: {
    startTime: number;
  };
}

export function logAxiosResponse(resp: AxiosResponse): number {
  const { config, status, statusText, request, data } = resp
  const fullUrl = `${config.baseURL}${request.path}`
  // eslint-disable-nextline
  const customConfig = config as CustomAxiosRequestConfig
  const requestedAt = customConfig.metadata?.startTime
  let requestedAtString = ''
  let responseTime = 0
  if (requestedAt) {
    // calculate response time
    responseTime = Date.now() - requestedAt

    // formatting datetime
    requestedAtString = new Date(requestedAt).toISOString()
  }

  const summaryLine = `${status} [${request.method}] – ${fullUrl}`
  // TODO
  // const rawRequestHeader = request._header

  Loggy.log(`[PerxClient:AccessLog] ${requestedAtString} : ${summaryLine}`, statusText,
    {
      requestBody: config.data || {},
      responseTime: `+(${responseTime})ms`,
      responseBody: data,
    })

  // TODO better return
  // minimun return the responseTime which used in _sendMetric function
  return responseTime
}
