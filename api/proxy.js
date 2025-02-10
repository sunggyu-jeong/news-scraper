export default async function handler(req, res) {
  try {
    // 요청된 URL을 query에서 가져옴 (예: /api/proxy?url=/user/login)
    const { url } = req.query;
    if (!url) {
      return res.status(400).json({ error: "URL parameter is required" });
    }

    // 전체 백엔드 API URL 생성
    const backendUrl = `${process.env.VUE_APP_SERVER_URL}${url}`;

    // 요청 옵션 설정 (GET, POST, PUT, DELETE 지원)
    const options = {
      method: req.method,
      headers: {
        ...req.headers,
        "Content-Type": "application/json",
        host: undefined, // Host 헤더 제거 (필요 시)
      },
    };

    // GET, HEAD 요청이 아니라면 body 포함
    if (!["GET", "HEAD"].includes(req.method)) {
      options.body = JSON.stringify(req.body);
    }

    // 백엔드로 요청 보내기
    const response = await fetch(backendUrl, options);
    const data = await response.text(); // JSON이 아닐 수도 있어서 text() 사용

    // 백엔드 응답을 그대로 클라이언트로 전달
    res.status(response.status).send(data);
  } catch (error) {
    console.error("Proxy Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
