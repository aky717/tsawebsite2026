"use client";
import React, { useState, useEffect } from "react";
import {
  Folder, FileText, Clock, Sun, Moon,
  ChevronDown, LogOut, Plus, Edit2, Trash2, Layers, Hash
} from "lucide-react";
import Link from "next/link";
import { LayoutDashboard, User } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Head from "next/head";
interface Project {
  name: string;
  keywords: string;
  createdAt: string;
  path: string;
}

export default function Dashboard() {
  const [username, setUsername] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [darkMode, setDarkMode] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("ecliptica_username") || "User";
    setUsername(storedName);
    const storedProjects = localStorage.getItem("ecliptica_projects");
    if (storedProjects) setProjects(JSON.parse(storedProjects));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ecliptica_username");
    window.location.href = "/";
  };

  const handleCreateProject = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://127.0.0.1:5000/run_ctm", {
        method: "POST",
      });

      if (!response.ok) throw new Error("Backend error");

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const fileName = contentDisposition?.split("filename=")[1]?.replaceAll('"', "") || "outputs.zip";
      const zipUrl = URL.createObjectURL(blob);

      const downloadLink = document.createElement("a");
      downloadLink.href = zipUrl;
      downloadLink.download = fileName;
      downloadLink.click();
      URL.revokeObjectURL(zipUrl);

      const newProject: Project = {
        name: fileName.replace(".zip", ""),
        keywords: "N/A",
        createdAt: new Date().toLocaleString(),
        path: `/outputs/${fileName}`,
      };

      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      localStorage.setItem("ecliptica_projects", JSON.stringify(updatedProjects));
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadNotice = (project: Project) => {
    toast.success(`${project.name} has been downloaded!`, {
      position: "bottom-right",
      autoClose: 4000,
      theme: darkMode ? "dark" : "light",
    });
  };

  const handleRename = (index: number) => {
    const newName = prompt("Enter new project name:", projects[index].name);
    if (newName) {
      const updated = [...projects];
      updated[index].name = newName;
      setProjects(updated);
      localStorage.setItem("ecliptica_projects", JSON.stringify(updated));
    }
  };

  const handleDelete = (index: number) => {
    if (confirm("Delete this project?")) {
      const updated = [...projects];
      updated.splice(index, 1);
      setProjects(updated);
      localStorage.setItem("ecliptica_projects", JSON.stringify(updated));
    }
  };

  function getMostCommonKeyword(projects: Project[]) {
    const freq: Record<string, number> = {};
    for (const project of projects) {
      const nameParts = project.name.split("_").filter(w => w !== "data" && w.length > 1);
      nameParts.forEach(w => freq[w] = (freq[w] || 0) + 1);
    }
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return sorted.length ? sorted[0][0] : "N/A";
  }

  return (
    <>
    <Head>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;1,300&display=swap"
        rel="stylesheet"
      />
    </Head>
      <div className={`min-h-screen flex ${darkMode ? "bg-[#0a0010] text-white" : "bg-white text-black"}`} style={{ fontFamily: "'Syne', sans-serif" }}>

        {/* Sidebar */}
        <aside className="w-64 min-h-screen bg-[#6b3a7a] border-r border-white/10 fixed top-0 left-0 px-6 pt-0">
        <Link href="/">
          <div className="flex justify-center mb-8 cursor-pointer">
            <img
              src="/imgs/luminex.png"
              alt="Luminex"
              className={`
                h-30 w-30 md:h-33 md:w-33 object-contain
                opacity-90
                [mask-image:radial-gradient(circle,white_60%,transparent_100%)]
                hover:scale-105 transition-all duration-300
              `}
            />
          </div>
        </Link>

        <nav className="space-y-5">
          <Link href="/dashboard" className="flex items-center space-x-3 hover:text-[#bd7cd0]">
            <LayoutDashboard /> <span>Dashboard</span>
          </Link>
          <Link href="/profile" className="flex items-center space-x-3 hover:text-[#bd7cd0]">
            <User /> <span>Profile</span>
          </Link>
        </nav>
      </aside>

        {/* Main page */}
        <div className="ml-64 flex-1 px-10 py-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold tracking-wide">Welcome {username}!</h1>
            <div className="flex items-center space-x-4 relative">
              <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
             <button onClick={() => setShowDropdown(!showDropdown)} className="flex items-center space-x-2 border px-3 py-1 rounded-full text-sm transition">
               <span>{username}</span>
               <ChevronDown className="w-4 h-4" />
            </button>
             {showDropdown && (
                <div className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-[#1e293b] border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-10">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Statistics at the Top */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 rounded-xl p-6 shadow ${darkMode ? "bg-[#0a0010]" : "bg-gray-100"}`}>
            <Card icon={<Layers className="h-6 w-6 text-[#6b3a7a]" />} title="Total Projects" value={projects.length.toString()} darkMode={darkMode} />
            <Card icon={<Hash className="h-6 w-6 text-[#6b3a7a]" />} title="Most Common Keyword" value={getMostCommonKeyword(projects)} darkMode={darkMode} />
            <Card icon={<Clock className="h-6 w-6 text-[#6b3a7a]" />} title="Latest Project" value={projects[0]?.name || "N/A"} darkMode={darkMode} />
          </div>


          {/* Projects Section */}
          <div className={`rounded-xl p-6 shadow ${darkMode ? "bg-[#0a0010]" : "bg-gray-100"}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Recent Projects</h2>
              <button onClick={handleCreateProject} disabled={loading} className="flex items-center space-x-2 bg-[#bd7cd0] text-white px-4 py-2 rounded-full hover:bg-purple-600 text-sm">
                <Plus className="w-4 h-4" />
                <span>{loading ? "Processing..." : "Create New Project"}</span>
              </button>
            </div>

            {loading && (
              <div className="flex justify-center items-center mb-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-4 border-purple-500"></div>
                <span className="ml-4 text-[#bd7cd0]">Generating outputs…</span>
              </div>
            )}

            <ul className="space-y-4">
              {(showAll ? projects : projects.slice(0, 4)).map((project, index) => (
                <li key={index} className={`flex items-center justify-between rounded-lg p-4 ${darkMode ? "bg-white/[0.03] border border-white/10" : "bg-gray-100"}`}>
                  <div className="flex items-center space-x-4">
                    <Folder className="text-purple-400" />
                    <div>
                      <h3 className="text-lg font-medium">{project.name}</h3>
                      <p className="text-sm text-gray-400">
                        <FileText className="inline w-4 h-4 mr-1" /> {project.keywords} | <Clock className="inline w-4 h-4 mx-1" /> {project.createdAt}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDownloadNotice(project)} className="bg-[#bd7cd0] text-white px-4 py-2 rounded-full text-sm hover:bg-purple-600">Download</button>
                    <Edit2 onClick={() => handleRename(index)} className="cursor-pointer text-purple-400 hover:text-purple-600" />
                    <Trash2 onClick={() => handleDelete(index)} className="cursor-pointer text-red-400 hover:text-red-600" />
                  </div>
                </li>
              ))}
            </ul>

            {projects.length > 4 && (
              <button onClick={() => setShowAll(!showAll)} className="mt-4 text-[#bd7cd0]">
                {showAll ? "Less" : "More"}
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

{/* Card Design */}
const Card = ({ icon, title, value }: any) => (
  <div className="bg-white/[0.03] border border-white/10 p-6 rounded-xl flex space-x-4">
    <div className="text-[#bd7cd0]">{icon}</div>
    <div>
      <p className="text-sm">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);
