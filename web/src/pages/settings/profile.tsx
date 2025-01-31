import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { ChangeEvent } from "react";
import { toast } from "react-hot-toast";

import CircularProgress from "../../components/Feedback/CircularProgress";
import ProfilePicture from "../../components/Settings/ProfilePicture";
import SettingsSection from "../../components/Settings/rows";
import { useProfile } from "../../context/ProfileContext";
import { GetCurrentUserInfo } from "../../request/fetch";
import {
  UpdateBirthday,
  UpdateCity,
  UpdateFirstName,
  UpdateGender,
  UpdateLastName,
  UpdatePhone,
  UpdateProfilePicture,
  UpdateState,
  UpdateZip,
} from "../../request/mutate";

export default function Settings() {
  const {
    data,
    isLoading,
    refetch: UserData,
  } = useQuery({
    queryKey: ["UserInfo"],
    queryFn: () => GetCurrentUserInfo(),
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });
  const { setProfilePicture, profilePicture } = useProfile();

  const { mutate: mutateUpdateFirstName } = useMutation({
    mutationFn: (Firstname: string) => UpdateFirstName(Firstname),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateUpdateLastName } = useMutation({
    mutationFn: (LastName: string) => UpdateLastName(LastName),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateUpdateGender } = useMutation({
    mutationFn: (gender: string) => UpdateGender(gender),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateUpdatePhone } = useMutation({
    mutationFn: (phone: string) => UpdatePhone(phone),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
      void UserData();
    },
  });

  const { mutate: mutateUpdateCity } = useMutation({
    mutationFn: (city: string) => UpdateCity(city),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateUpdateState } = useMutation({
    mutationFn: (state: string) => UpdateState(state),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: mutateUpdateZip } = useMutation({
    mutationFn: (zip_code: string) => UpdateZip(zip_code),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  //update bday
  const { mutate: mutateUpdateBday } = useMutation({
    mutationFn: (bday: string) => UpdateBirthday(bday),
    onSuccess: () => {
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const { mutate: updateProfile, isLoading: isUpdatingProfile } = useMutation({
    mutationKey: ["update_profile"],
    mutationFn: UpdateProfilePicture,
    onSuccess: (data) => {
      toast.success("Profile updated");
      setProfilePicture(data?.message);
      void UserData();
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  const handleUpdateImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;
    if (file.type !== "image/jpeg" && file.type !== "image/png") {
      return toast.error("Invalid image type. Only jpg, png are allowed.");
    }

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      if (!fileReader.result) {
        return toast.error("Could not read file.");
      }
      if (fileReader.result.toString().length > 8 * 1024 * 1024) {
        return toast.error("Image size is too large. Max size is 8MB.");
      }
      // Update the profile image
      console.log(fileReader.result.toString());
      updateProfile(fileReader.result.toString());
    };
  };
  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="mx-auto flex max-w-4xl flex-col md:px-8 xl:px-0">
          <main className="flex-1">
            <div className="relative mx-auto max-w-4xl md:px-8 xl:px-0">
              <div className="pt-10 pb-16">
                <div className="px-4 sm:px-6 md:px-0">
                  <h1 className="text-3xl font-extrabold text-gray-900">
                    Settings
                  </h1>
                </div>
                <div className="px-4 sm:px-6 md:px-0">
                  {!data || isLoading ? (
                    <CircularProgress
                      className={"mx-auto my-12 scale-[200%]"}
                    />
                  ) : (
                    <div className="py-6">
                      {/* Description list with inline editing */}
                      <div className="mt-10 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Profile
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            This information will be displayed publicly so be
                            careful what you share.
                          </p>
                        </div>
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <ProfilePicture
                              Name="Profile Picture"
                              Value={profilePicture}
                              onImageChange={handleUpdateImage}
                              isLoading={isUpdatingProfile}
                            />
                            <SettingsSection
                              Name="First Name"
                              Value={data.first_name}
                              OnSet={mutateUpdateFirstName}
                            />
                            <SettingsSection
                              Name="Last Name"
                              Value={data.last_name}
                              OnSet={mutateUpdateLastName}
                            />
                            <SettingsSection
                              Name="Gender"
                              Value={data.gender}
                              OnSet={mutateUpdateGender}
                            />

                            <SettingsSection
                              Name="Birthday"
                              Value={data.birthday}
                              OnSet={mutateUpdateBday}
                            />
                            <SettingsSection
                              Name="Phone"
                              Value={data.phone_number}
                              OnSet={mutateUpdatePhone}
                            />
                          </dl>
                        </div>
                      </div>

                      <div className="mt-10 divide-y divide-gray-200">
                        <div className="space-y-1">
                          <h3 className="text-lg font-medium leading-6 text-gray-900">
                            Location
                          </h3>
                          <p className="max-w-2xl text-sm text-gray-500">
                            Easily customize your location preferences.
                          </p>
                        </div>
                        <div className="mt-6">
                          <dl className="divide-y divide-gray-200">
                            <SettingsSection
                              Name="City"
                              Value={data.city}
                              OnSet={mutateUpdateCity}
                            />
                            <SettingsSection
                              Name="State"
                              Value={data.state}
                              OnSet={mutateUpdateState}
                            />
                            <SettingsSection
                              Name="Zip-Code"
                              Value={data.zip_code}
                              OnSet={mutateUpdateZip}
                            />
                          </dl>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
