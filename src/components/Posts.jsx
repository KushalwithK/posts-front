import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { POST_ENDPOINT, MEDIA_URL, API_SINGLETON } from '../extras/Constant'
import { CREATE_POST_ROUTE, UPDATE_POST_ROUTE } from '../extras/Routes'

const Posts = () => {
    const [posts, setPosts] = useState([])

    const getAllPosts = () => {
        API_SINGLETON.get(POST_ENDPOINT).then((result) => {
            console.log(result);
            setPosts(result.data)
        })
    }

    useEffect(() => {
        getAllPosts()
    }, [])

    const handlePostDelete = (id) => {
        API_SINGLETON.delete(POST_ENDPOINT + id).then((response) => {
            console.log(response)
            getAllPosts()
        }).catch((error) => {
            console.log(error);
        })
    }

    return (
        <div className="w-full pt-10 p-10">
            <div className="items-center justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">
                        Posts
                    </h3>
                    <p className="text-gray-600 mt-2">
                        Lists of all posts
                    </p>
                </div>
                <div className="mt-3 md:mt-0">
                    <Link
                        to={CREATE_POST_ROUTE}
                        className="inline-block px-4 py-2 text-white duration-150 font-medium bg-indigo-600 rounded-lg hover:bg-indigo-500 active:bg-indigo-700 md:text-sm"
                    >
                        Add post
                    </Link>
                </div>
            </div>
            <div className="mt-12 shadow-sm border rounded-lg overflow-x-auto">
                <table className="w-full table-auto text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600 font-medium border-b">
                        <tr>
                            <th className="py-3 px-6">ID</th>
                            <th className="py-3 px-6">Title</th>
                            <th className="py-3 px-6">Description</th>
                            <th className="py-3 px-6">Image</th>
                            <th className="py-3 px-6"></th>

                        </tr>
                    </thead>
                    <tbody className="text-gray-600 divide-y">
                        {
                            posts.map((item, idx) => (
                                <tr key={idx}>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <a href={MEDIA_URL + item.image} target='__blank'>
                                            <img
                                                src={MEDIA_URL + item.image}
                                                className="h-20"
                                                alt="" />
                                        </a>
                                    </td>
                                    <td className="text-right px-6 whitespace-nowrap">
                                        <Link to={UPDATE_POST_ROUTE + item.id} className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
                                            Edit
                                        </Link>
                                        <button
                                            className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg"
                                            onClick={() => handlePostDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default Posts