// Membuat kelas error custom yang mewarisi sifat dari Error bawaan JavaScript
export class ApiError extends Error {

    // properti tambahan diluar sifat "Error" untuk menyimpan status HTTP (400, 404, 500, dll.)
    statusCode: number

    // constructor dipanggil setiap ApiError dibuat dengan "new ApiError(...)"
    constructor(statusCode: number, message: string) {

        // memanggil constructor parent (Error) dan mengisi nilai message
        // mandatory saat membuat class turunan/inherit
        super(message)

        // menambahkan properti statusCode ke object ApiError
        this.statusCode = statusCode

        // Memperbaiki prototype chain agar instance ini benar-benar dianggap sebagai ApiError
        Object.setPrototypeOf(this, new.target.prototype)

        // Menangkap stack trace secara akurat, menunjuk ke lokasi error yang sebenarnya
        Error.captureStackTrace(this)

    }
}
