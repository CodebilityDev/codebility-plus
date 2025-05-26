import Post from "./Post";

const samplePosts = [
  {
    id: 1,
    user: "Ben Kelly",
    userImage: "/assets/images/bg-certificate.png",
    content:
      "This is Jason Derulo. He owns 13 different income streams that make millions...",
    timestamp: "6h ago",
    images: ["/assets/images/bg-certificate.png"],
    reactions: { likes: 7, comments: 229 },
  },
  {
    id: 2,
    user: "Jane Smith",
    userImage: "/assets/images/bg-certificate.png",
    content: "Hello world! This is my first post.",
    timestamp: "5h ago",
    images: [
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
    ],
    reactions: { likes: 15, comments: 10 },
  },
  {
    id: 3,
    user: "Alice Johnson",
    userImage: "/assets/images/bg-certificate.png",
    content: "Loving this platform!",
    timestamp: "1d ago",
    images: [
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
    ],
    reactions: { likes: 20, comments: 5 },
  },
  {
    id: 4,
    user: "John Doe",
    userImage: "/assets/images/bg-certificate.png",
    content: "Check out these amazing photos!",
    timestamp: "2d ago",
    images: [
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
      "/assets/images/bg-certificate.png",
    ],
    reactions: { likes: 50, comments: 30 },
  },
  {
    id: 5,
    user: "John Doe",
    userImage: "/assets/images/bg-certificate.png",
    content: "Hello",
    timestamp: "2d ago",
    images: [],
    reactions: { likes: 50, comments: 30 },
  },
];

export default function Feed() {
  return (
    <div className="flex flex-col">
      {samplePosts.map((post) => (
        <Post
          key={post.id}
          user={post.user}
          userImage={post.userImage}
          content={post.content}
          timestamp={post.timestamp}
          images={post.images}
          reactions={post.reactions}
        />
      ))}
    </div>
  );
}
