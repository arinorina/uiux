"use client";
import { getFilmById } from "@/api";
import { FC, useContext, useEffect, useState } from "react";
import { MovieList } from "@/api";
import { useParams } from "next/navigation";
import { Audio } from "react-loader-spinner";
import { useComments } from "../../hooks/useComments";
import { Header } from "@/components/Header/Header";
import { Theme } from "@/store/theme";
import { useRouter } from "next/router";
import res from "../../../public/static/res.png";
import download from "../../../public/static/download.png";
import Image from "next/image";

const Details: FC = () => {
  const [movieDetails, setMovieDetails] = useState<MovieList>();
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState({
    name: "",
    text: "",
  });
  const id = useParams()?.id;
  const [showDownload, setShowDownload] = useState(false);
  const { comments, updateComments, deleteComment } = useComments(id);
  const { currentTheme } = useContext(Theme);
  const router = useRouter();

  const onCommentChange = (e) => {
    setComment((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSendComment = () => {
    updateComments(id, comment);
    setComment({ name: "", text: "" });
  };

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        setLoading(true);
        const response: MovieList = await getFilmById(id);
        setMovieDetails(response);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  return (
    
    
    <div
      className={`py-10 ${currentTheme == "black" ? "Ob1127" : "A4C8F2"} bg`}>
      <Header arrowBack={true} />
      {!loading ? (
        <section className="min-h-screen flex items-center flex-col pb-20 px-16 relative">
          <Image
            src={movieDetails?.background_image}
            width={1000}
            height={500}
            alt="bg"
            style={{ maxHeight: "730px", height: "730px", objectFit: "cover" }}
            className="absolute  opacity-20 w-full brightness-10 p-100"
          />
          <div className="container mx-15 py-20 flex flex-col lg:flex-row items-center">
            <div>
              <div
                style={{
                  minWidth: "300px",
                  width: "100%",
                  maxWidth: "400px",
                  minHeight: "500px",
                  position: "relative",
                }}
                className="mb-5">
                <Image
                  layout="fill"
                  loading="lazy"
                  src={movieDetails?.large_cover_image || ""}
                  alt={movieDetails?.title || ""}
                />
              </div>
              <div className="flex justify-between mb-8">
                <button
                  onClick={() => {
                    router.push(movieDetails?.url || "");
                  }}
                  className="py-6 px-6 lex items-center justify-center border-[#3B2B4E] text-[#3B2B4E] bg-[#FEBD64] font-extrabold cursor-pointer rounded-md hover:bg-[#67498B] z-index-5">
                  Watch now
                </button>
                <button
                  onClick={() => {
                    setShowDownload(!showDownload);
                  }}
                  className="py-4 px-6 flex-items-center justify-center border-[#3B2B4E] bg-[#FEBD64] font-extrabold cursor-pointer text-[#3B2B4E] rounded-md hover:bg-[#67498B] z-index-5">
                  Download
                </button>
              </div>
            </div>

            <div className="flex flex-col w-full lg:pl-20 z-index-5 self-stretch mt-2">
              <p className="text-[#22192D] text-3xl mb-2">{movieDetails?.title}</p>
              {movieDetails?.description_full && (
                <p className="text-[#22192D] text-2xl mb-2">
                  {movieDetails?.description_full}
                </p>
              )}
              <div className="flex flex-row justify-between mb-8 min-w-fit pt-10">
                <div className="min-w-min max-w-full">
                  {
                    movieDetails?.genres ? (
                      <div className="text-[#22192D] mb-3 text-xl flex flex-wrap items-baseline">
                        <p className="w-1/3 pe-4">
                          Genres:</p>
                        {
                          movieDetails?.genres?.map((genre, index) => (
                            <b
                              className="bg-[#67498B] p-2 text-base rounded-md ml-2 mb-3"
                              key={index}>
                              {genre}
                            </b>
                          ))
                        }
                      </div>
                    ) : ""
                  }
                  {
                    movieDetails?.rating ? (
                      <div className="text-[#22192D] mb-3 text-xl flex flex-wrap items-baseline">
                        <p className="w-1/3 pe-4"> Rating: </p>
                        <b
                          className="bg-[#67498B] p-2 text-base rounded-md ml-2 mb-3"
                          key={movieDetails.rating}>
                          {movieDetails.rating}
                        </b>
                      </div>
                    ) : ""
                  }
                  {
                    movieDetails?.like_count ? (
                      <div className="text-[#22192D] mb-3 text-xl flex flex-wrap items-baseline">
                        <p className="w-1/3 pe-14"> Likes: </p>
                        <b
                          className="bg-[#67498B] p-2 text-base rounded-md ml-2 mb-3"
                          key={movieDetails.like_count}>
                          {movieDetails.like_count}
                        </b>
                      </div>
                    ) : ""
                  }
                  {
                    movieDetails?.language ? (
                      <div className="text-[#22192D] mb-3 text-xl flex flex-wrap items-baseline">
                        <p className="w-1/3 pe-20"> Language: </p>
                        <b
                          className="bg-[#67498B] p-2 text-base rounded-md ml-2 mb-3"
                          key={movieDetails.language}>
                          {movieDetails.language}
                        </b>
                      </div>
                    ) : ""
                  }
                  {
                    movieDetails?.runtime ? (
                      <div className="text-[#22192D] mb-3 text-xl flex flex-wrap items-baseline">
                        <p className="w-1/3 pe-20"> Runtime: </p>
                        <b
                          className="bg-[#67498B] p-2 text-base rounded-md ml-2 mb-3"
                          key={movieDetails.runtime}>
                          {movieDetails.runtime}
                        </b>
                      </div>
                    ) : ""
                  }

                </div>
                <div className="grid-flow-row right-0">
                  {showDownload &&
                    movieDetails?.torrents?.map((torrent, index) => (
                      <a
                        href={torrent.url}
                        key={index}
                        className="flex border-2 bg-[#F5CD95] text-[#594076] p-3 mb-2 rounded-md items-center border-transparent hover:bg-[#B46C6A] w-56 h-14 mr-5">
                        <Image
                          src={download}
                          alt="Download"
                          className="mr-2 w-12 invert"
                        />
                        <span className="font-extrabold text-[#594076] text-center">
                          {torrent.quality}/{torrent.size}<br />{torrent.type}
                        </span>
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <div className="container flex flex-col">
            <p className="text-3xl font-bold text-[#FEBD64] mb-5">Comments</p>
            <p className="text-[#3B2B4E] mb-2">Name</p>
            <input
              name="name"
              onChange={onCommentChange}
              value={comment.name}
              type="text"
              className="w-80 bg-transparent border-2 p-2 mb-2 rounded-md text-[#B46C6A]"
            />
            <p className="text-[#3B2B4E] mb-2">Comment</p>
            <textarea
              value={comment.text}
              onChange={onCommentChange}
              name="text"
              className="w-full bg-transparent border-2 p-2 rounded-md text-[#B46C6A]"
            />
            <button
              onClick={onSendComment}
              className="ml-auto text-[#F5CD95] bg-[#594076] border-2 rounded-md p-3 mt-3 hover:bg-[#FEBD64] hover:text-[#291F35]">
              Send
            </button>
            <div className="flex flex-col mt-10">
              {comments.length != 0 ?
                comments?.map((comment, index) => (
                  <div
                    key={index}
                    className="flex flex-col border bg-[#594076] w-full p-5 text-[#FEBD64] font-bold rounded-md mb-3">
                    <p className="text-xl extrabold mb-2">{comment.name}</p>
                    <p className="text-[#F5CD95] font-normal">{comment.text}</p>
                    <button
                      onClick={() => deleteComment(comment)}
                      className="ml-auto font-extrabold hover:text-[#F5CD95]">
                      DELETE
                    </button>
                  </div>
                )) :
                <div className="flex flex-col border bg-[#594076] w-full p-5 text-[#F5CD95] rounded-md mb-3 text-2xl">
                  <span>
                    No comments yet.
                    Be first to comment!
                  </span>
                </div>}
            </div>
          </div>
        </section>
      ) : (
        <div className="flex justify-center items-center min-w-full min-h-screen">
          
        </div>
      )}
    </div>
  );
};

export default Details;
