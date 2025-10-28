import { and, desc, eq, ne } from 'drizzle-orm'
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

  // --- Get Addresses ---
  async getAddresses(user_id: number) {
    const addressList = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.user_id, user_id), ne(addresses.is_default, true)))
      .orderBy(desc(addresses.createdAt))
    return addressList
  }
}

const addressService = new AddressService()
export default addressService
