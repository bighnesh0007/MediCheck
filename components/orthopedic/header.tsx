interface HeaderProps {
    userName: string;
  }
  
  export default function Header({ userName }: HeaderProps) {
    return (
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Orthopedic Care Center</h1>
        <p className="text-xl text-gray-600">Welcome, {userName}</p>
        <p className="text-lg text-gray-600">Comprehensive care for your musculoskeletal health</p>
      </header>
    )
  }