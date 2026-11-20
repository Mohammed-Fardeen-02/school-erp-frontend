import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApiClient, ApiClientError } from './api-client';

describe('ApiClient.downloadFile (CSV & Binary File Streaming)', () => {
  let client: ApiClient;

  beforeEach(() => {
    vi.clearAllMocks();
    client = new ApiClient('https://api.erp.test/v1');
  });

  it('streams file and extracts standard filename from Content-Disposition', async () => {
    const mockBlob = new Blob(['col1,col2\nval1,val2'], { type: 'text/csv' });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(mockBlob, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="audit_logs_2026-11-20.csv"',
        },
      })
    );

    const result = await client.downloadFile('/audit-logs/export');
    expect(result.filename).toBe('audit_logs_2026-11-20.csv');
    expect(result.blob).toBeDefined();
  });

  it('extracts and decodes RFC 5987 / RFC 6266 UTF-8 filename* from Content-Disposition', async () => {
    const mockBlob = new Blob(['col1,col2\nval1,val2'], { type: 'text/csv' });
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(mockBlob, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': "attachment; filename*=UTF-8''audit_report_%E2%9C%93.csv",
        },
      })
    );

    const result = await client.downloadFile('/audit-logs/export');
    expect(result.filename).toBe('audit_report_✓.csv');
  });

  it('parses error envelope and throws ApiClientError when response is not ok', async () => {
    const errorBody = JSON.stringify({
      success: false,
      error: {
        code: 'TENANT_FORBIDDEN',
        message: 'You are not authorized to export audit logs for this campus',
      },
    });

    vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
      Promise.resolve(
        new Response(errorBody, {
          status: 403,
          statusText: 'Forbidden',
          headers: { 'Content-Type': 'application/json' },
        })
      )
    );

    await expect(client.downloadFile('/audit-logs/export')).rejects.toThrow(ApiClientError);
    await expect(client.downloadFile('/audit-logs/export')).rejects.toThrow(
      'You are not authorized to export audit logs for this campus'
    );
  });

  it('transmits tenant and location headers in download request', async () => {
    client.setTenantContext('org_test_100', 'loc_campus_a');
    client.setToken('test_token_jwt');

    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      new Response(new Blob(['test']), {
        status: 200,
        headers: { 'Content-Disposition': 'attachment; filename="test.csv"' },
      })
    );

    await client.downloadFile('/audit-logs/export');

    expect(fetchSpy).toHaveBeenCalledWith(
      'https://api.erp.test/v1/audit-logs/export',
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-Organization-Id': 'org_test_100',
          'X-Location-Id': 'loc_campus_a',
          Authorization: 'Bearer test_token_jwt',
        }),
      })
    );
  });
});

