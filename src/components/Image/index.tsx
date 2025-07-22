import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'

const name = 'Image'

const config = {
	imageUrl: {
		type: 'custom',
		render: ({ onChange, value }: { name: string; onChange: (objectUrl: string) => {}; value: string }) => {
			const [previewUrl, setPreviewUrl] = useState<string | null>(value || null)
			const [isUploading, setIsUploading] = useState(false)

			const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
				const file = e.target.files?.[0]
				if (!file) return

				try {
					setIsUploading(true)

					// Create a temporary preview
					const objectUrl = URL.createObjectURL(file)
					setPreviewUrl(objectUrl)

					// Get the upload URL with required body
					const response = await fetch('https://y6jx3q6f5c.execute-api.eu-west-1.amazonaws.com/v2/core/util/generate-upload-url', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
						},
						body: JSON.stringify({
							id: uuidv4(),
							contentType: file.type,
						}),
					})
					const { data } = await response.json()

					console.log('the data url', data, file)

					// Upload the file to S3
					await fetch(data.uploadUrl, {
						method: 'PUT',
						body: file,
						headers: {
							'Content-Type': file.type,
						},
					})

					// Use the final file URL
					onChange(data.fileUrl)
				} catch (error) {
					console.error('Error uploading file:', error)
					// Revert preview on error
					setPreviewUrl(value)
				} finally {
					setIsUploading(false)
				}
			}

			return (
				<div>
					<input type='file' accept='image/*' onChange={handleFileChange} disabled={isUploading} />
					{isUploading && <div>Uploading...</div>}
					{previewUrl && (
						<div style={{ marginTop: '1em' }}>
							<img src={previewUrl} alt='Preview' style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
						</div>
					)}
				</div>
			)
		},
	},
}

const render = ({ imageUrl }: { imageUrl: string }) => {
	return (
		<div style={{ textAlign: 'center', margin: '1em 0' }}>
			{imageUrl && <img src={imageUrl} alt='Rendered' style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }} />}
		</div>
	)
}

export default {
	name,
	config,
	render,
}
