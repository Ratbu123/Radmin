import { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaChartBar } from "react-icons/fa";

export default function Insights() {
  const [blogs, setBlogs] = useState([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [editingId, setEditingId] = useState(null);

  const categories = ["Technology", "Business", "Marketing", "Finance", "Health"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("http://localhost:5000/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createOrUpdateBlog = async (e) => {
    e.preventDefault();
    if (!title || !category || !excerpt || !date) return alert("All fields required");

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/blogs/${editingId}`, {
          title,
          category,
          excerpt,
          date,
        });
        setEditingId(null);
      } else {
        await axios.post("http://localhost:5000/blogs", { title, category, excerpt, date });
      }
      setTitle(""); setCategory(""); setExcerpt(""); setDate(new Date().toISOString().slice(0,10));
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const editBlog = (blog) => {
    setEditingId(blog.id);
    setTitle(blog.title);
    setCategory(blog.category);
    setExcerpt(blog.excerpt);
    setDate(blog.date);
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this insight?")) return;
    try {
      await axios.delete("http://localhost:5000/blogs", { data: { ids: [id] } });
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  // Count insights per category
  const categoryCounts = categories.reduce((acc, cat) => {
    acc[cat] = blogs.filter(b => b.category === cat).length;
    return acc;
  }, {});

  return (
    <div className="insights-page">
      {/* Top stats */}
      <div className="insights-stats">
        <div className="stat-card total">
          <h3>Total Insights</h3>
          <p>{blogs.length}</p>
        </div>
        {categories.map(cat => (
          <div className="stat-card" key={cat}>
            <h4>{cat}</h4>
            <p>{categoryCounts[cat]}</p>
          </div>
        ))}
      </div>

      <div className="insights-main">
        {/* Left: Add/Edit Insight */}
        <div className="insights-left">
          <div className="insight-form-card">
            <h2>{editingId ? "Edit Insight" : "Create Insight"}</h2>
            <form onSubmit={createOrUpdateBlog}>
              <label>Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />

              <label>Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)} required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <label>Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} required />

              <label>Excerpt</label>
              <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={5} required />

              <div className="form-buttons">
                <button type="reset" onClick={() => {setEditingId(null); setTitle(""); setCategory(""); setExcerpt(""); setDate(new Date().toISOString().slice(0,10))}}>Cancel</button>
                <button type="submit">{editingId ? "Update Insight" : "Add Insight"}</button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: Recent Insights */}
        <div className="insights-right">
          <div className="recent-insights-card">
            <h2>Recent Insights</h2>
            <ul className="recent-list">
              {blogs.map(blog => (
                <li key={blog.id} className="recent-item">
                  <div className="recent-text">
                    <h4>{blog.title}</h4>
                    <p>{blog.category} • {blog.date}</p>
                  </div>
                  <div className="recent-actions">
                    <FaEdit className="action-icon edit" title="Edit" onClick={() => editBlog(blog)} />
                    <FaTrashAlt className="action-icon delete" title="Delete" onClick={() => deleteBlog(blog.id)} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}