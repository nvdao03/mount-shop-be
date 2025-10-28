import { db } from '~/configs/postgreSQL.config'
import { addresses } from '~/db/schema'
import { AddAddressRequestBody } from '~/requests/address.request'

class AddressService {
  // --- Add Address ---
  async addAddress(user_id: number, data: AddAddressRequestBody) {
    const [address] = await db
      .insert(addresses)
      .values({
        user_id,
        ...data
      })
      .returning()
    return address
  }
}

const addressService = new AddressService()
export default addressService
