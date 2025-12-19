class cloudinaryService
{
    static async uploadImageToCloudinary(file) {
    let formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "JsITIProject");

    let res = await fetch(
        "https://api.cloudinary.com/v1_1/dhenynh4v/image/upload",
        {
            method: "POST",
            body: formData
        }
    );

    let data = await res.json();
    return data.secure_url;
}

}
