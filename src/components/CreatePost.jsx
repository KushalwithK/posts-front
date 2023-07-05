import React, { useState } from 'react'
import { POST_ENDPOINT, API_SINGLETON } from '../extras/Constant'
import { BsFillImageFill } from 'react-icons/bs'
import { useNavigate } from 'react-router-dom';

const CreatePost = () => {

    const [errors, setErrors] = useState({
        title: false,
        description: false
    })
    const [data, setData] = useState({
        'title': "",
        'description': ""
    })
    const navigate = useNavigate();

    const handleCreatePost = (event) => {
        event.preventDefault()
        if (data.title == "") setErrors({ ...errors, title: true })
        if (data.description == "") setErrors({ ...errors, description: true })
        if (data.title != "") setErrors({ ...errors, title: false })
        if (data.description != "") setErrors({ ...errors, description: false })
        if (event.target[0].value != "" && event.target[1].value != "") {
            var formData = new FormData(event.target);
            API_SINGLETON.post(POST_ENDPOINT, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            }).then((result) => {
                console.log(result)
                event.target.reset()
                navigate('/')
            }).catch((error) => {
                console.log(error)
            })
        }
    }

    return (
        <div className='w-full flex justify-center items-center'>
            <form method='POST' encType='multipart/form-data' onSubmit={handleCreatePost}>
                <div className="mt-10 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="first-name" className="block text-m font-medium leading-6 text-gray-900">
                            Post Title
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                name="title"
                                id="postTitle"
                                autoComplete="given-name"
                                placeholder='ex. My First Blog Post'
                                className="block w-full rounded-md border-0 p-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                onChange={(event) => {
                                    setData({ ...data, title: event.currentTarget.value })
                                }}
                            />
                            {errors.title && <span className='mt-1 block text-m font-regular leading-6 text-purple-800'>Title is required!</span>}
                        </div>
                    </div>
                </div>
                <div className="mt-5 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="first-name" className="block text-m font-medium leading-6 text-gray-900">
                            Post Description
                        </label>
                        <div className="mt-2">
                            <textarea
                                name="description"
                                id="postDescription"
                                rows={3}
                                className="block p-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder={'ex. Protein is very essential for human body...'}
                                onChange={(event) => {
                                    setData({ ...data, description: event.currentTarget.value })
                                }}
                            />
                            {errors.description && <span className='mt-1 block text-m font-regular leading-6 text-purple-800'>Description is required!</span>}
                        </div>
                    </div>
                </div>

                <div className="mt-5 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="col-span-4">
                        <label htmlFor="cover-photo" className="block text-m font-medium leading-6 text-gray-900">
                            Cover photo
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                            <div className="text-center">
                                <BsFillImageFill className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="image" type="file" className="sr-only" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs leading-5 text-gray-600">IMAGE up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-5 ml-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <button
                        type="reset"
                        className="rounded-lg bg-transparent px-6 py-3 text-sm font-medium text-indigo-600 border-solid border-2 border-indigo-600 shadow-sm hover:bg-indigo-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Reset Form
                    </button>
                    <button
                        type="submit"
                        className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Create Post
                    </button>
                </div>
            </form >
        </div>
    )
}

export default CreatePost