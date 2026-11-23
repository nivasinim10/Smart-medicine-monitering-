# Debug review and targeted fixes

Compared against Smart_Medicine_Fullstack.zip.

Fixes applied:
- Reject acknowledgement before the scheduled time (prevents premature TAKEN/stock deduction).
- Ignore client-supplied acknowledgement timestamps and use server time.
- Check medication existence before claiming stock deduction.
- Validate stock, units-per-dose and refill thresholds as nonnegative/integer as appropriate.
- Check uploaded PDF/PNG/JPEG file signatures rather than trusting MIME type alone.
- Include UPCOMING dose events in the device state response.

Still needs attention:
- Reminder monitor hardcodes 5/10 minutes and ignores schedule.missedAfterMinutes.
- The background monitor runs every minute; reminder transitions may be late by up to a minute.
- Stock decrement and stockDeductedAt are not one atomic transaction; failures can cause inconsistencies.
- Local prescription files need private durable storage, malware scanning, and operational backup for production.
- Device-state endpoint returns one event, not all three slots.
- Full integration tests require a configured MongoDB Atlas database and real ESP32 hardware.
