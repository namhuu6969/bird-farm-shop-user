import axiosClient from '../AxiosClient'

const APIs_URL = {
  BOOKING: '/booking',
  BOOKING_ID: (id: number) => `/booking/${id}`,
  BOOKING_STATUS: (status: string) => `/booking?status=${status}`,
  BOOKING_UPDATE_STATUS: (id: number, status: string) => `/booking/${id}/${status}`,
  BOOKING_USERID: (id: number) => `booking/users/${id}`,
  ADD_BIRDPAIRING: `birdparing?bookingDetailId`
}

export const getBookingByIdAPI = async (id: number) => {
  return await axiosClient.get(APIs_URL.BOOKING_ID(id))
}

export const getBookingByStatusAPI = async (status: string) => {
  return await axiosClient.get(APIs_URL.BOOKING_STATUS(status))
}

export const updateBookingStatusAPI = async (id: number, status: string) => {
  return await axiosClient.put(APIs_URL.BOOKING_UPDATE_STATUS(id, status))
}

export const getBookingByUserIdAPI = async (id: number) => {
  return await axiosClient.get(APIs_URL.BOOKING_USERID(id))
}

export const postBirdPairing = async (id: { bookingDetailId: number }) => {
  return await axiosClient.post(APIs_URL.ADD_BIRDPAIRING, id)
}
