import {db} from '@/firebase/firebase'

export default async function getOne(collection, id) {
	let record = await db.collection(collection).doc(id).get().then();
	return record.data();
}