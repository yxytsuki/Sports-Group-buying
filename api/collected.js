import request from '@/utils/request'
import axios from 'axios'
export const getCollectedCourse = (param) => {
	return request.post('/api/getCollectCourse', {
		...param
	})
}