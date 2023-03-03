import axios from 'axios';
import jwtDecode from 'jwt-decode';

const setAuthToken = token => {
	// console.log(" token ius: ",jwtDecode(token))
	if (token) {
		axios.defaults.headers.common['Authorization'] = 'Bearer '+token;
	} else {
		delete axios.defaults.headers.common['Authorization'];
	}
};

export default setAuthToken;
