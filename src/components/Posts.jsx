import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as AlertDialog from "@radix-ui/react-alert-dialog";
import { POST_ENDPOINT, MEDIA_URL, API_SINGLETON } from "../extras/Constant";
import { CREATE_POST_ROUTE, UPDATE_POST_ROUTE } from "../extras/Routes";

const Posts = () => {
  const [posts, setPosts] = useState([]);

  const getAllPosts = () => {
    API_SINGLETON.get(POST_ENDPOINT).then((result) => {
      console.log(result);
      setPosts(result.data);
    });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  const handlePostDelete = (id) => {
    API_SINGLETON.delete(POST_ENDPOINT + id)
      .then((response) => {
        console.log(response);
        getAllPosts();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-full pt-10 p-10">
      <div className="items-center justify-between md:flex">
        <div className="max-w-lg">
          <h3 className="text-gray-800 text-xl font-bold sm:text-2xl">Posts</h3>
          <p className="text-gray-600 mt-2">Lists of all posts</p>
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
            {posts.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a href={MEDIA_URL + item.image} target="__blank">
                    <img src={MEDIA_URL + item.image} className="h-20" alt="" />
                  </a>
                </td>
                <td className="text-right px-6 whitespace-nowrap">
                  <Link
                    to={UPDATE_POST_ROUTE + item.id}
                    className="py-2 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg"
                  >
                    Edit
                  </Link>
                  <AlertDialog.Root>
                    <AlertDialog.Trigger asChild>
                      <button className="py-2 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
                        Delete
                      </button>
                    </AlertDialog.Trigger>
                    <AlertDialog.Portal>
                      <AlertDialog.Overlay
                        style={{ zIndex: 99 }}
                        className="bg-blackA9 data-[state=open]:animate-overlayShow fixed inset-0"
                      />
                      <AlertDialog.Content
                        style={{ zIndex: 999 }}
                        className="data-[state=open]:animate-contentShow fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[6px] bg-white p-[25px] shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] focus:outline-none"
                      >
                        <AlertDialog.Title className="text-mauve12 m-0 text-[17px] font-medium">
                          Are you absolutely sure?
                        </AlertDialog.Title>
                        <AlertDialog.Description className="text-mauve11 mt-4 mb-5 text-[15px] leading-normal">
                          This action cannot be undone. This will permanently
                          delete your post and remove the data from our servers.
                        </AlertDialog.Description>
                        <div className="flex justify-end gap-[25px]">
                          <AlertDialog.Cancel asChild>
                            <button className="text-mauve11 bg-mauve4 hover:bg-mauve5 focus:shadow-mauve7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]">
                              Cancel
                            </button>
                          </AlertDialog.Cancel>
                          <AlertDialog.Action asChild>
                            <button
                              className="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-medium leading-none outline-none focus:shadow-[0_0_0_2px]"
                              onClick={() => handlePostDelete(item.id)}
                            >
                              Yes, delete post
                            </button>
                          </AlertDialog.Action>
                        </div>
                      </AlertDialog.Content>
                    </AlertDialog.Portal>
                  </AlertDialog.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Posts;
