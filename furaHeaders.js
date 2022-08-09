const furaHeaders = new Headers();
furaHeaders.append("sec-ch-ua", "\".Not/A)Brand\";v=\"99\", \"Google Chrome\";v=\"103\", \"Chromium\";v=\"103\"");
furaHeaders.append("accept", "*/*");
furaHeaders.append("content-type", "application/json");
furaHeaders.append("sec-ch-ua-mobile", "?0");
furaHeaders.append("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36");
furaHeaders.append("sec-ch-ua-platform", "\"Windows\"");
furaHeaders.append("Sec-Fetch-Site", "cross-site");
furaHeaders.append("Sec-Fetch-Mode", "cors");
furaHeaders.append("Sec-Fetch-Dest", "empty");
furaHeaders.append("host", "api.fura.org");

export { furaHeaders };