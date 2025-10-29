import Layout from "@/components/Layout";

export default function Organizations() {
  const organizations = [
    {
      name: "МУПВ ВПЭС",
      houses: 273,
      phone: "+7 (423) 240-00-00",
      email: "info@vpes.ru",
    },
    {
      name: 'ООО "Дальневосточные Электрические Сети"',
      houses: 0,
      phone: "+7 (423) 245-12-34",
      email: "support@des.ru",
    },
    {
      name: 'АО "Оборонэнерго"',
      houses: 0,
      phone: "+7 (423) 231-45-67",
      email: "contact@oboron.ru",
    },
  ];

  return (
    <Layout>
      <div className="max-w-[1368px] mx-auto px-4 lg:px-0 py-8 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-dark-text tracking-tight">
            Управляющие организации
          </h1>
          <p className="text-base text-gray-text">
            Контакты служб и количество обслуживаемых домов
          </p>
        </div>

        <div className="space-y-6">
          {organizations.map((org, i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-border bg-white shadow-sm p-6"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-dark-text">
                      {org.name}
                    </h3>
                    <p className="text-sm text-gray-text">
                      Обслуживает {org.houses} {org.houses === 1 ? 'дом' : org.houses < 5 ? 'дома' : 'домов'}
                    </p>
                  </div>

                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                  >
                    <path
                      d="M8 29.333V5.333C8 4.626 8.281 3.948 8.781 3.448C9.281 2.947 9.959 2.667 10.667 2.667H21.333C22.041 2.667 22.719 2.947 23.219 3.448C23.719 3.948 24 4.626 24 5.333V29.333H8Z"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8 16H5.333C4.626 16 3.948 16.281 3.448 16.781C2.947 17.281 2.667 17.959 2.667 18.667V26.667C2.667 27.374 2.947 28.052 3.448 28.552C3.948 29.052 4.626 29.333 5.333 29.333H8"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 12H26.667C27.374 12 28.052 12.281 28.552 12.781C29.052 13.281 29.333 13.959 29.333 14.667V26.667C29.333 27.374 29.052 28.052 28.552 28.552C28.052 29.052 27.374 29.333 26.667 29.333H24"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.333 8H18.667"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.333 13.333H18.667"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.333 18.667H18.667"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.333 24H18.667"
                      stroke="#6B7280"
                      strokeWidth="2.67"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <div className="border-t border-gray-border pt-4 flex items-center gap-6 flex-wrap">
                  <a
                    href={`tel:${org.phone}`}
                    className="flex items-center gap-2 text-orange-primary hover:text-orange-primary/80 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M14.667 11.28V13.28C14.667 13.466 14.629 13.65 14.555 13.82C14.48 13.99 14.371 14.143 14.235 14.268C14.098 14.394 13.936 14.489 13.76 14.549C13.584 14.608 13.398 14.63 13.213 14.614C11.162 14.391 9.191 13.69 7.46 12.567C5.849 11.543 4.483 10.178 3.46 8.567C2.333 6.828 1.632 4.848 1.413 2.787C1.396 2.603 1.418 2.417 1.477 2.241C1.537 2.066 1.632 1.905 1.756 1.768C1.881 1.631 2.033 1.522 2.202 1.447C2.372 1.372 2.555 1.334 2.74 1.334H4.74C5.063 1.33 5.377 1.445 5.622 1.656C5.868 1.867 6.028 2.16 6.073 2.48C6.158 3.12 6.314 3.749 6.54 4.354C6.629 4.592 6.649 4.852 6.596 5.101C6.543 5.35 6.419 5.579 6.24 5.76L5.393 6.607C6.342 8.276 7.724 9.658 9.393 10.607L10.24 9.76C10.421 9.581 10.65 9.457 10.899 9.404C11.149 9.351 11.408 9.371 11.647 9.46C12.251 9.686 12.88 9.842 13.52 9.927C13.844 9.973 14.139 10.136 14.351 10.385C14.562 10.635 14.675 10.953 14.667 11.28Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm">{org.phone}</span>
                  </a>

                  <a
                    href={`mailto:${org.email}`}
                    className="flex items-center gap-2 text-orange-primary hover:text-orange-primary/80 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M13.333 2.667H2.667C1.93 2.667 1.333 3.263 1.333 4V12C1.333 12.736 1.93 13.333 2.667 13.333H13.333C14.07 13.333 14.667 12.736 14.667 12V4C14.667 3.263 14.07 2.667 13.333 2.667Z"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14.667 4.667L8.687 8.467C8.481 8.595 8.243 8.664 8 8.664C7.757 8.664 7.519 8.595 7.313 8.467L1.333 4.667"
                        stroke="currentColor"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm">{org.email}</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
