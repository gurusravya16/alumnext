import { useAuth } from "../context/AuthContext";

const cards = [
  {
    title: "Profile",
    description: "View and manage your profile information.",
    icon: "👤",
  },
  {
    title: "Connections",
    description: "Discover and connect with alumni and students.",
    icon: "🤝",
  },
  {
    title: "Opportunities",
    description: "Explore career opportunities and mentorship.",
    icon: "💼",
  },
];

export default function Dashboard() {
  const { role } = useAuth();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 capitalize">
        {role} Dashboard
      </h2>
      <p className="mt-2 text-sm text-gray-600">
        Welcome to your dashboard. Here&apos;s an overview of your activity.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg bg-white p-6 shadow-md border border-gray-100"
          >
            <span className="text-3xl">{card.icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              {card.title}
            </h3>
            <p className="mt-2 text-sm text-gray-600">{card.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
