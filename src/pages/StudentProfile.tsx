import { useState, useEffect } from "react";

type StudentProfile = {
  id: string;
  name: string;
  email: string;
  class: string;
  joinedDate: string;
  completedQuizzes: number;
  averageScore: number;
};

export default function StudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<StudentProfile>>({});

  // mock data fetch (WILL BE REPLACED with actual API calls)
  useEffect(() => {
    const fetchProfile = async () => {
      const mockProfile: StudentProfile = {
        id: "stu123",
        name: "John Doe",
        email: "john@example.com",
        class: "10th Grade",
        joinedDate: "2023-09-15",
        completedQuizzes: 12,
        averageScore: 85,
      };
      setProfile(mockProfile);
      setFormData(mockProfile);
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (profile) {
      setProfile({ ...profile, ...formData });
    }
    setIsEditing(false);
  };

  if (!profile) {
    return <div className="p-4">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              Student Profile
            </h1>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Edit Profile
              </button>
            ) : (
              <div className="space-x-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="class"
                    value={formData.class || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-gray-900">{profile.class}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Joined Date
                </label>
                <p className="mt-1 text-gray-900">{profile.joinedDate}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Completed Quizzes
                </label>
                <p className="mt-1 text-gray-900">{profile.completedQuizzes}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Average Score
                </label>
                <p className="mt-1 text-gray-900">{profile.averageScore}%</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Quiz History</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600">
                Recent quiz performance charts would go here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
