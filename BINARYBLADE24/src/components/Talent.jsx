import React, { useState } from "react";

const freelancers = [
  {
    id: 1,
    name: "Alice Johnson",
    title: "Senior React Developer",
    skills: ["React", "Node.js", "JavaScript"],
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=1",
    hourly_rate: 75,
    level: "Senior",
    thumbnail: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "Bob Williams",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "Adobe XD"],
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?img=2",
    hourly_rate: 60,
    level: "Mid-Level",
    thumbnail: "https://i.pravatar.cc/150?img=2",
  },
  {
    id: 3,
    name: "Charlie Brown",
    title: "Full-Stack Developer",
    skills: ["Python", "Django", "React", "AWS"],
    rating: 4.7,
    avatar: "https://i.pravatar.cc/150?img=3",
    hourly_rate: 80,
    level: "Senior",
    thumbnail: "https://i.pravatar.cc/150?img=3",
  },
  {
    id: 4,
    name: "Diana Miller",
    title: "Content Writer",
    skills: ["SEO", "Blogging", "Copywriting"],
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=7",
    hourly_rate: 50,
    level: "Expert",
    thumbnail: "https://i.pravatar.cc/150?img=9",
  },
  {
    id: 6,
    name: "Alice Johnson",
    title: "Senior React Developer",
    skills: ["React", "Node.js", "JavaScript"],
    rating: 4.9,
    avatar: "https://i.pravatar.cc/150?img=1",
    hourly_rate: 75,
    level: "Senior",
    thumbnail: "https://i.pravatar.cc/150?img=4",
  },
  {
    id: 7,
    name: "Bob Williams",
    title: "UI/UX Designer",
    skills: ["Figma", "Sketch", "Adobe XD"],
    rating: 4.8,
    avatar: "https://i.pravatar.cc/150?img=2",
    hourly_rate: 60,
    level: "Mid-Level",
    thumbnail: "https://i.pravatar.cc/150?img=5",
  },
];

const FindTalent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFreelancers = freelancers.filter(
    (freelancer) =>
      freelancer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      freelancer.skills.some((skill) =>
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Find Talent</h1>

        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            placeholder="Search by name or skill..."
            className="px-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFreelancers.map((freelancer) => (
            <div
              key={freelancer.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="relative">
                <img
                  src={freelancer.thumbnail}
                  alt={freelancer.title}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 right-2 bg-blue-900 text-white px-2 py-1 text-xs font-bold rounded">
                  {freelancer.level}
                </span>
                <div className="absolute bottom-0 left-0 p-4 flex items-center">
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="w-12 h-12 rounded-full border-2 border-white"
                  />
                  <h2 className="text-lg font-bold text-white ml-2">
                    {freelancer.name}
                  </h2>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-600 mb-4">{freelancer.title}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-green-600">
                    ${freelancer.hourly_rate}/hr
                  </p>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600">
                      {freelancer.rating}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindTalent;
