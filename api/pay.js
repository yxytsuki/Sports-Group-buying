import request from '@/utils/request'
import axios from 'axios'

export const getLinkContent = () => {
	return request.get('http://127.0.0.1:4523/m1/6035558-5725382-default/getLinkContent')
}