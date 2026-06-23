const { test, expect } = require('@playwright/test');
const bookingData = require('../../test-data/bookingData.json');

/**
 * Creates an authentication token for update and delete requests.
 */
async function createAuthToken(request) {
  const response = await request.post('/auth', {
    data: {
      username: 'admin',
      password: 'password123',
    },
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.token).toBeTruthy();

  return responseBody.token;
}

/**
 * Creates a booking and returns the booking ID and response body.
 */
async function createBooking(
  request,
  booking = bookingData.newBooking
) {
  const response = await request.post('/booking', {
    data: booking,
  });

  expect(response.status()).toBe(200);

  const responseBody = await response.json();

  expect(responseBody.bookingid).toEqual(expect.any(Number));
  expect(responseBody.booking).toMatchObject(booking);

  return responseBody;
}

/**
 * Deletes test data after a test completes.
 */
async function cleanupBooking(request, bookingId, token) {
  if (!bookingId || !token) {
    return;
  }

  await request.delete(`/booking/${bookingId}`, {
    headers: {
      Cookie: `token=${token}`,
    },
  });
}

test.describe('Restful Booker API Tests', () => {
  test('should return a list of booking IDs', async ({ request }) => {
    const response = await request.get('/booking');

    expect(response.status()).toBe(200);
    expect(response.ok()).toBeTruthy();

    const responseBody = await response.json();

    expect(Array.isArray(responseBody)).toBeTruthy();

    if (responseBody.length > 0) {
      expect(responseBody[0]).toHaveProperty('bookingid');
    }
  });

  test('should create and retrieve a booking', async ({ request }) => {
    const token = await createAuthToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid;

    try {
      const response = await request.get(
        `/booking/${bookingId}`
      );

      expect(response.status()).toBe(200);

      const responseBody = await response.json();

      expect(responseBody).toEqual(
        expect.objectContaining(bookingData.newBooking)
      );
    } finally {
      await cleanupBooking(request, bookingId, token);
    }
  });

  test('should completely update a booking using PUT', async ({
    request,
  }) => {
    const token = await createAuthToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid;

    try {
      const updateResponse = await request.put(
        `/booking/${bookingId}`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
          data: bookingData.updatedBooking,
        }
      );

      expect(updateResponse.status()).toBe(200);

      const updatedResponseBody = await updateResponse.json();

      expect(updatedResponseBody).toEqual(
        expect.objectContaining(bookingData.updatedBooking)
      );

      // Verify that the update was saved on the server.
      const getResponse = await request.get(
        `/booking/${bookingId}`
      );

      expect(getResponse.status()).toBe(200);

      const savedBooking = await getResponse.json();

      expect(savedBooking).toEqual(
        expect.objectContaining(bookingData.updatedBooking)
      );
    } finally {
      await cleanupBooking(request, bookingId, token);
    }
  });

  test('should partially update a booking using PATCH', async ({
    request,
  }) => {
    const token = await createAuthToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid;

    const partialUpdate = {
      firstname: 'Updated Firstname',
      additionalneeds: 'Late checkout',
    };

    try {
      const updateResponse = await request.patch(
        `/booking/${bookingId}`,
        {
          headers: {
            Cookie: `token=${token}`,
          },
          data: partialUpdate,
        }
      );

      expect(updateResponse.status()).toBe(200);

      const updatedBooking = await updateResponse.json();

      expect(updatedBooking.firstname).toBe(
        partialUpdate.firstname
      );

      expect(updatedBooking.additionalneeds).toBe(
        partialUpdate.additionalneeds
      );

      // An unchanged field should retain its original value.
      expect(updatedBooking.lastname).toBe(
        bookingData.newBooking.lastname
      );
    } finally {
      await cleanupBooking(request, bookingId, token);
    }
  });

  test('should reject a complete update without authentication', async ({
    request,
  }) => {
    const token = await createAuthToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid;

    try {
      const response = await request.put(
        `/booking/${bookingId}`,
        {
          data: bookingData.updatedBooking,
        }
      );

      expect(response.status()).toBe(403);
    } finally {
      await cleanupBooking(request, bookingId, token);
    }
  });

  test('should delete a booking and verify it no longer exists', async ({
    request,
  }) => {
    const token = await createAuthToken(request);
    const createdBooking = await createBooking(request);
    const bookingId = createdBooking.bookingid;

    const deleteResponse = await request.delete(
      `/booking/${bookingId}`,
      {
        headers: {
          Cookie: `token=${token}`,
        },
      }
    );

    expect(deleteResponse.status()).toBe(201);

    const getResponse = await request.get(
      `/booking/${bookingId}`
    );

    expect(getResponse.status()).toBe(404);
  });

  test('should return 404 for a booking that does not exist', async ({
    request,
  }) => {
    const response = await request.get(
      '/booking/999999999999'
    );

    expect(response.status()).toBe(404);
  });
});