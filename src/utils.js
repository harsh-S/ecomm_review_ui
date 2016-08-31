function to_ddmmyy(date){
	let dd = date.getDate(),
		mm = date.getMonth()+1,
		yy = parseInt(date.getFullYear()/100)
	if(dd<10) dd +='0'
	if(mm<10) mm +='0'
	return dd+'/'+mm+'/'+yy
}
