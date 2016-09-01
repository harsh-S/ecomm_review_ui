export function to_ddmmyy(date){
	let dd = date.getDate(),
		mm = date.getMonth()+1,
		yy = date.getFullYear()%100
	if(dd<10) dd = '0' + dd
	if(mm<10) mm = '0' + mm
	return dd+'/'+mm+'/'+yy
}
