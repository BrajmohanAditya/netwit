'use server';

interface FacebookPostResponse {
  id: string;
  success: boolean;
  error?: string;
}

export async function postVehicleToFacebook(vehicleId: string): Promise<FacebookPostResponse> {
  return { id: '', success: false, error: 'Facebook integration requires Convex' };
}
