/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Heading,
  IconButton,
  List,
  ListItem,
  Text,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { InfoIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { addDays, formatDate, subtractDays } from "../utils/date";

export default function Calendar() {
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const [currentDate, setCurrentDate] = useState<Date>(new Date("2024-07-08"));
  const [availableHours, setAvailableHours] = useState<string[]>([]);
  const [blockedHours, setBlockedHours] = useState<string[]>([]);

  const toast = useToast();

  /**
   * @description function responsible for fetch the available hours for the current user
   *
   * IF: the user has available hours, it will return and array of available hours as string (example: ['10:00', '10:30'])
   * IF THE USER DOESN'T HAVE ANY AVAILABLE HOURS: it will return 204 and it will set the availableHours state as an empty string
   * IF THE SERVER IS DOWN: print the error on the console
   */
  const fetchAvailableHours = useCallback(async (date: Date) => {
    setStatus("pending");

    try {
      const response = await fetch(
        `/api/available-hours?date=${formatDate(date)}`
      );

      if (response.status === 204) {
        setStatus("success");
        setAvailableHours([]);
        return;
      }

      const data = await response.json();

      setStatus("success");
      setAvailableHours(data);
    } catch (error) {
      setStatus("error");
      console.error(error);
    }
  }, []);

  /**
   * @description schedules an hour with the current user
   *
   * IF: response === 404
   * THEN: the hour is already taken and client is warned to choose other hour
   * ELSE: schedule the selected hour and blocks the hour to current client
   *
   * @param {string} hour
   * @returns {void}
   */
  const schedule = async (hour: string) => {
    if (blockedHours.includes(hour)) {
      return;
    }

    const body: any = {
      date: `${formatDate(currentDate)} ${hour}`,
    };
    const response = await fetch("/api/schedule", {
      method: "POST",
      body,
    });

    const data = await response.json();

    if (response.status === 404) {
      toast({
        description: data.message,
        status: "error",
        duration: 5000,
      });

      return;
    } else {
      toast({
        description: "Horário agendado",
        status: "success",
        duration: 5000,
      });
    }

    setBlockedHours((prev) => [...prev, hour]);
  };

  /**
   * each time the currentDate state updates, makes a call to fetchAvailableHours function
   */
  useEffect(() => {
    fetchAvailableHours(currentDate);
  }, [fetchAvailableHours, currentDate]);

  /**
   * @description header component for the app. Container the owner of the calendar name, the current selected date, and two buttons to go to the next and the previous day
   * @returns {JSX.Element}
   */
  const Header = () => {
    return (
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        gap={10}
        marginBottom={5}
      >
        <Box alignItems="center" flexDirection="column" display="flex" gap={1}>
          <Heading fontSize={28}>Agenda de Hugo Cicarelli</Heading>
          <Text>Clique em um horário para agendar</Text>
        </Box>
        <Box alignItems="center" display="flex" gap={5}>
          <IconButton
            colorScheme="teal"
            aria-label="Dia anterior"
            icon={<ChevronLeftIcon fontSize={28} />}
            onClick={() => setCurrentDate((prev) => subtractDays(prev, 1))}
          />
          <Text>{formatDate(new Date(currentDate), "PPP")}</Text>
          <IconButton
            colorScheme="teal"
            aria-label="Próximo dia"
            icon={<ChevronRightIcon fontSize={28} />}
            onClick={() => {
              setCurrentDate((prev) => addDays(prev, 1));
            }}
          />
        </Box>
      </Box>
    );
  };

  // if status = success the call to get the available hours have finished and nothing was found. Then shows the empty state
  if (status === "success" && availableHours.length === 0) {
    return (
      <Box
        padding={10}
        alignItems="center"
        display="flex"
        flexDirection="column"
      >
        <Header />
        <Text>Não existem horários disponíveis.</Text>
      </Box>
    );
  }

  /**
   * function to get the color scheme for the hours buttons
   *
   * if gray: hour is blocked
   * if orange: hour was not blocked when fetched the results of available hours, but it will be blocked if clicked to schedule
   * if teal: available hour
   *
   * @param {string} hour
   * @returns {string} return the colorScheme for the button
   */
  const getColorScheme = (hour: string): "gray" | "orange" | "teal" => {
    const isBlockedHour = hour.indexOf("10") > -1;

    if (blockedHours.includes(hour)) {
      return "gray";
    }

    if (isBlockedHour) {
      return "orange";
    }

    return "teal";
  };

  return (
    <Box padding={10} alignItems="center" display="flex" flexDirection="column">
      <Header />

      <List spacing={3} width={1000}>
        {availableHours.map((hour) => {
          const isBlockedHour = hour.indexOf("10") > -1;

          return (
            <ListItem key={hour}>
              <Button
                width={1000}
                colorScheme={getColorScheme(hour)}
                justifyContent={isBlockedHour ? "space-between" : "flex-start"}
                onClick={() => schedule(hour)}
                disabled={blockedHours.includes(hour)}
              >
                {hour}
                {isBlockedHour ? (
                  <Tooltip label="Horário bloqueado para simular quando um horário foi agendado após carregar a listagem">
                    <InfoIcon />
                  </Tooltip>
                ) : null}
              </Button>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
