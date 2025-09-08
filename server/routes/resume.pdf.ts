export default eventHandler(async (event) => {
  const { page } = await hubBrowser()
  const origin = getRequestURL(event).origin

  await page.goto(`${origin}/_resume`, { waitUntil: 'networkidle0' })

  setHeader(event, 'Content-Type', 'application/pdf')
  return page.pdf({
    format: 'A4',
    printBackground: true,
    pageRanges: '1',
  })
})
