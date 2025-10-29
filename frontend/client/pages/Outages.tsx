import Layout from "@/components/Layout";

export default function Outages() {
  const outages = [
    {
      address: "ул. Ленина, 45",
      type: "planned",
      houses: 12,
      time: "08:00 - 18:00",
      utility: "Электричество",
      icon: "electricity",
      iconColor: "orange",
    },
    {
      address: "пр. Победы, 23-67",
      type: "emergency",
      houses: 156,
      time: "06:00 - 20:00",
      utility: "Вода",
      icon: "water",
      iconColor: "red",
    },
    {
      address: "мкр. Центральный",
      type: "planned",
      houses: 234,
      time: "09:00 - 17:00",
      utility: "Вода",
      icon: "water",
      iconColor: "orange",
    },
    {
      address: "ул. Садовая, 12",
      type: "emergency",
      houses: 3,
      time: "10:00 - 14:00",
      utility: "Электричество",
      icon: "electricity",
      iconColor: "red",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-dark-text tracking-tight">
            Текущие отключения
          </h1>
          <p className="text-base text-gray-text">
            Активные и плановые работы
          </p>
        </div>

        <div className="space-y-6">
          {outages.map((outage, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-border bg-white shadow-sm p-6"
            >
              <div className="flex items-start gap-6">
                <div
                  className={`p-3 rounded-xl ${
                    outage.iconColor === "red"
                      ? "bg-red-light"
                      : "bg-orange-light"
                  }`}
                >
                  {outage.icon === "electricity" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 14C3.811 14.001 3.625 13.948 3.465 13.847C3.305 13.747 3.176 13.603 3.095 13.432C3.013 13.261 2.981 13.071 3.003 12.883C3.026 12.695 3.101 12.517 3.22 12.37L13.12 2.17C13.194 2.084 13.296 2.027 13.407 2.006C13.519 1.985 13.634 2.003 13.734 2.057C13.834 2.11 13.913 2.196 13.957 2.3C14.002 2.404 14.01 2.521 13.98 2.63L12.06 8.65C12.003 8.802 11.984 8.965 12.005 9.125C12.025 9.286 12.084 9.439 12.176 9.572C12.268 9.704 12.392 9.813 12.535 9.887C12.679 9.962 12.838 10.001 13 10H20C20.189 10 20.375 10.053 20.535 10.153C20.695 10.254 20.824 10.398 20.905 10.569C20.987 10.739 21.019 10.93 20.997 11.117C20.974 11.305 20.899 11.483 20.78 11.63L10.88 21.83C10.806 21.916 10.704 21.974 10.593 21.994C10.481 22.015 10.366 21.997 10.266 21.944C10.166 21.89 10.087 21.804 10.043 21.7C9.998 21.596 9.99 21.479 10.02 21.37L11.94 15.35C11.997 15.199 12.016 15.036 11.995 14.875C11.975 14.714 11.916 14.562 11.824 14.429C11.732 14.296 11.608 14.188 11.465 14.113C11.321 14.038 11.162 14 11 14H4Z"
                        stroke={outage.iconColor === "red" ? "#EF4343" : "#FA893D"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                  {outage.icon === "water" && (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 22C13.857 22 15.637 21.263 16.95 19.95C18.263 18.637 19 16.857 19 15C19 13 18 11.1 16 9.5C14 7.9 12.5 5.5 12 3C11.5 5.5 10 7.9 8 9.5C6 11.1 5 13 5 15C5 16.857 5.738 18.637 7.05 19.95C8.363 21.263 10.143 22 12 22Z"
                        stroke={outage.iconColor === "red" ? "#EF4343" : "#FA893D"}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-semibold text-dark-text">
                      {outage.address}
                    </h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                        outage.type === "emergency"
                          ? "bg-red-alert text-white"
                          : "bg-dark-text text-white"
                      }`}
                    >
                      {outage.type === "emergency" ? "Авария" : "Плановое"}
                    </span>
                  </div>

                  <div className="flex items-center gap-6 flex-wrap text-sm text-gray-text">
                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M8.75 12.25V7.583C8.75 7.429 8.689 7.28 8.579 7.171C8.47 7.061 8.321 7 8.167 7H5.833C5.679 7 5.53 7.061 5.421 7.171C5.311 7.28 5.25 7.429 5.25 7.583V12.25" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M1.75 5.833C1.75 5.664 1.787 5.496 1.858 5.342C1.93 5.188 2.034 5.052 2.164 4.942L6.247 1.443C6.457 1.265 6.724 1.167 7 1.167C7.276 1.167 7.543 1.265 7.753 1.443L11.836 4.942C11.966 5.052 12.07 5.188 12.142 5.342C12.213 5.496 12.25 5.664 12.25 5.833V11.083C12.25 11.393 12.127 11.69 11.908 11.908C11.69 12.127 11.393 12.25 11.083 12.25H2.917C2.607 12.25 2.311 12.127 2.092 11.908C1.873 11.69 1.75 11.393 1.75 11.083V5.833Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{outage.houses} домов</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M7 12.833C10.222 12.833 12.833 10.222 12.833 7C12.833 3.778 10.222 1.167 7 1.167C3.778 1.167 1.167 3.778 1.167 7C1.167 10.222 3.778 12.833 7 12.833Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M7 3.5V7L9.333 8.167" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{outage.time}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M8.575 3.675C8.468 3.784 8.408 3.931 8.408 4.083C8.408 4.236 8.468 4.383 8.575 4.492L9.508 5.425C9.617 5.532 9.764 5.592 9.917 5.592C10.069 5.592 10.216 5.532 10.325 5.425L12.524 3.226C12.818 3.874 12.906 4.596 12.779 5.296C12.651 5.996 12.314 6.641 11.81 7.144C11.307 7.647 10.663 7.985 9.963 8.112C9.263 8.24 8.541 8.151 7.893 7.858L3.862 11.888C3.63 12.12 3.315 12.251 2.987 12.251C2.659 12.251 2.344 12.12 2.112 11.888C1.88 11.656 1.749 11.342 1.749 11.013C1.749 10.685 1.88 10.37 2.112 10.138L6.143 6.108C5.849 5.459 5.76 4.737 5.888 4.037C6.015 3.337 6.353 2.693 6.856 2.19C7.359 1.687 8.004 1.349 8.704 1.221C9.404 1.094 10.126 1.183 10.774 1.476L8.581 3.669L8.575 3.675Z" stroke="currentColor" strokeWidth="1.17" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{outage.utility}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
