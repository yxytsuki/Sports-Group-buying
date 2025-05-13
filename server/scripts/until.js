function formatDate(ts) {
	const date = new Date(Number(ts));
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	return `${y}/${m}/${d}`;
}

function formatFullTime(ts) {
	if (!ts) return '';
	const date = new Date(Number(ts));
	const y = date.getFullYear();
	const m = pad(date.getMonth() + 1);
	const d = pad(date.getDate());
	const h = pad(date.getHours());
	const min = pad(date.getMinutes());
	return `${y}/${m}/${d} ${h}:${min}`;
}
module.exports = {
	formatDate,
	formatFullTime

};