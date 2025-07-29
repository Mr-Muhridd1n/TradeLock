import React from "react";

export const Header = ({ title }) => {
  return (
    <>
      {title == "home" && (
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <div className="flex flex-col text-center py-5">
            <h1 className="text-2xl font-bold">Teade Lock</h1>
            <p className="opacity-90">Xavfsiz Savdo Platformasi</p>
          </div>
        </div>
      )}
      {title == "savdolar" && (
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <div className="flex flex-col text-center py-5">
            <h1 className="text-2xl font-bold">Savdolar</h1>
            <p className="opacity-90">Sizning savdolaringiz ma'lumoti</p>
          </div>
        </div>
      )}
      {title == "new_savdolar" && (
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <div className="flex flex-col text-center py-5">
            <h1 className="text-2xl font-bold">Yangi savdo</h1>
            <p className="opacity-90">
              Savdolaringiz uchun sozlamalarni sozlang
            </p>
          </div>
        </div>
      )}
      {title == "hamyon" && (
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <div className="flex flex-col text-center py-5">
            <h1 className="text-2xl font-bold">Hamyon</h1>
            <p className="opacity-90">Sizning balansingiz haqida ma'lumot</p>
          </div>
        </div>
      )}
      {title == "sozlamalar" && (
        <div className="bg-gradient-to-br from-[#4facfe] to-[#00f2fe]">
          <div className="flex flex-col text-center py-5">
            <h1 className="text-2xl font-bold">Sozlamalar</h1>
            <p className="opacity-90">Sizning maxfiy sozlamalaringiz</p>
          </div>
        </div>
      )}
    </>
  );
};
