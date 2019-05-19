import PyPDF2 


pdfFileObj = open('words.pdf', 'rb') 
pdfReader = PyPDF2.PdfFileReader(pdfFileObj)
print(pdfReader.numPages) 
pageObj = pdfReader.getPage(1)
print(pageObj.extractText()) 
pdfFileObj.close() 