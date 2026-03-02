import { useState, useEffect } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "http://localhost:5000/testimonials";

export default function Testimonials() {
  const [showModal, setShowModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [rating, setRating] = useState(5);
  const [author, setAuthor] = useState("");
  const [quote, setQuote] = useState("");
  const [testimonials, setTestimonials] = useState([]);
  const [selected, setSelected] = useState({});

  // Fetch testimonials from DB
  const fetchTestimonials = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setTestimonials(data);
    const initialSelected = {};
    data.forEach((t) => (initialSelected[t.id] = false));
    setSelected(initialSelected);
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, author, quote }),
    });
    const data = await res.json();
    if (data.success) {
      fetchTestimonials();
      setShowModal(false);
      resetForm();
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating, author, quote }),
    });
    const data = await res.json();
    if (data.success) {
      fetchTestimonials();
      setEditModal(false);
      resetForm();
    } else {
      alert(data.error || "Something went wrong");
    }
  };

  const resetForm = () => {
    setRating(5);
    setAuthor("");
    setQuote("");
    setEditId(null);
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(selected).filter((id) => selected[id]);
    if (idsToDelete.length === 0) return alert("No testimonial selected!");
    const confirmDelete = window.confirm(`Delete ${idsToDelete.length} testimonial(s)?`);
    if (!confirmDelete) return;

    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: idsToDelete }),
    });
    const data = await res.json();
    if (data.success) {
      fetchTestimonials();
    } else {
      alert(data.error || "Delete failed");
    }
  };

  const handleEdit = () => {
    const ids = Object.keys(selected).filter((id) => selected[id]);
    if (ids.length !== 1) return alert("Select exactly one testimonial to edit.");
    const t = testimonials.find((t) => t.id === Number(ids[0]));
    setEditId(t.id);
    setRating(t.rating);
    setAuthor(t.author);
    setQuote(t.quote);
    setEditModal(true);
  };

  // Chart
  const ratingCounts = [1, 2, 3, 4, 5].map(
    (r) => testimonials.filter((t) => t.rating === r).length
  );

  const chartData = {
    labels: ["1 Star", "2 Stars", "3 Stars", "4 Stars", "5 Stars"],
    datasets: [
      {
        label: "Number of Ratings",
        data: ratingCounts,
        backgroundColor: ["#ff4d4f", "#ff7a45", "#ffa940", "#36cfc9", "#73d13d"],
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Ratings Distribution" },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  return (
    <div className="testimonials-wrapper">
      {/* Header */}
      <div className="testimonials-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage client feedback and analytics</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          + Add New
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h4>Total Testimonials</h4>
          <h2>{testimonials.length}</h2>
        </div>
        <div className="stat-card">
          <h4>Average Rating</h4>
          <h2>
            {(
              testimonials.reduce((sum, t) => sum + Number(t.rating), 0) /
              (testimonials.length || 1)
            ).toFixed(1)}
          </h2>
        </div>
      </div>

      {/* Charts Section with Featured Testimonial */}
      <div className="charts-grid">
        <div className="chart-card">
          <Bar data={chartData} options={chartOptions} />
        </div>

        <div className="featured-card">
          <div className="ribbon">Featured</div>
          <div className="medal">🏅</div>
          <h3>Client Spotlight</h3>
          {testimonials.length > 0 ? (
            <div className="testimonial-content">
              <p>"{testimonials[0].quote}"</p>
              <span className="author">- {testimonials[0].author}</span>
              <div className="stars">
                {Array.from({ length: testimonials[0].rating }).map((_, i) => (
                  <FaStar key={i} />
                ))}
              </div>
            </div>
          ) : (
            <p>No testimonials yet.</p>
          )}
        </div>
      </div>

      {/* Table with Edit/Delete */}
      <div className="table-card">
        <div className="table-header" style={{ justifyContent: "space-between" }}>
          <h3>Recent Testimonials</h3>
          <div className="table-controls">
            <button className="add-btn" onClick={handleEdit}>
              Edit
            </button>
            <button className="add-btn" onClick={handleDelete} style={{ background: "#ff4d4f" }}>
              Delete
            </button>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Select</th>
              <th>Author</th>
              <th>Rating</th>
              <th>Quote</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((t) => (
              <tr key={t.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected[t.id] || false}
                    onChange={() =>
                      setSelected({ ...selected, [t.id]: !selected[t.id] })
                    }
                  />
                </td>
                <td>{t.author}</td>
                <td>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <FaStar key={i} className="stars" />
                  ))}
                </td>
                <td>{t.quote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Add New Testimonial</h2>
              <FaTimes className="close-icon" onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quote</label>
                <textarea
                  rows="4"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Save Testimonial</button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Testimonial</h2>
              <FaTimes className="close-icon" onClick={() => setEditModal(false)} />
            </div>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <div className="form-group">
                <label>Rating</label>
                <select value={rating} onChange={(e) => setRating(e.target.value)}>
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
              <div className="form-group">
                <label>Author</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Quote</label>
                <textarea
                  rows="4"
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}