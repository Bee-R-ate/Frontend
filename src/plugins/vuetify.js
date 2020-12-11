import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

const opts = {
	icons: {
		iconfont: 'mdi', 
	},
	theme: {
		themes: {
			light: {
				primary: '#EA611A',
				secondary: '#fff',
				error: 'black'
			}
		}
	}
	
}

export default new Vuetify(opts)