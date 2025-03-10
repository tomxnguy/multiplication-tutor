import { Outlet } from "react-router";

export default function Header() {
  return (
    <div>
      <header className="flex justify-center w-full bg-cyan-600">
        <div className="flex justify-center py-3">
          <h1 className="text-5xl font-bold text-blue-900">Math Tutor</h1>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
