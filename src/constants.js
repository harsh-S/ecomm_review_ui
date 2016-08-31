const SORT_OPTION_MOST_HELPFUL = 1
const SORT_OPTION_MOST_RECENT = 2
const SORT_OPTION_HIGHEST_FIRST = 3
const SORT_OPTION_LOWEST_FIRST = 4

const sort_options = (function(){
	let dict = {}
	dict[SORT_OPTION_MOST_HELPFUL] = {title: 'Most Helpful Reviews', value: 'Most Helpful'}
	dict[SORT_OPTION_MOST_RECENT] = {title: 'Most Recent Reviews', value: 'Most Recent'}
	dict[SORT_OPTION_HIGHEST_FIRST] = {title: 'Highest Rated Reviews', value: 'Highest First'}
	dict[SORT_OPTION_LOWEST_FIRST] = {title: 'Lowest Rated Reviews', value: 'Lowest First'}
	return dict
})()