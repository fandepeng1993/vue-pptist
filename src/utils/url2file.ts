import axios from '../services/config'

export async function urlToFileWithMeta(
  url: string,
  onProgress?: (percent: number) => void
): Promise<File> {
  const res:any = await axios.get<Blob>(url, {
    responseType: 'blob',
    returnResponse: true,
    onDownloadProgress(progressEvent:any) {
      if (!onProgress) return
      const percent = Math.round(
        (progressEvent.loaded * 100) / (progressEvent.total ?? 1)
      )
      onProgress(percent)
    }
  } as any)

  // ① MIME 从响应头取
  const mimeType = res?.headers['content-type'] || 'application/octet-stream'

  // ② 文件名从 Content-Disposition 头里解析
  const disposition = res.headers['content-disposition']
  let filename = 'unknown'
  if (disposition) {
    // 优先匹配 filename*=utf-8''xxx
    const utf8Match = disposition.match(/filename\*=utf-8''(.+)/i)
    if (utf8Match) {
      filename = decodeURIComponent(utf8Match[1].replace(/['"]/g, ''))
    }
    else {
      // 再匹配 filename="xxx"
      const match = disposition.match(/filename[^;=\n]*=([^;\n]*)/i)
      if (match) filename = match[1].replace(/['"]/g, '')
    }
  }

  // ③ 用真实的名字 & MIME 生成 File
  return new File([res.data], filename, { type: mimeType })
}